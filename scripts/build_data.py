#!/usr/bin/env python3
"""COSMOGRAPHIA data build — turns real public astronomical datasets into
compact JSON for the app. Run once; outputs are committed so the app needs
no network at runtime.

Sources:
  - Stars: HYG v4.1 (astronexus/HYG-Database)  — real J2000 positions,
    magnitudes, distances, spectral classes, proper & Bayer names.
  - Deep sky: Wikipedia "List of Messier objects" — all 110 real entries.
  - Constellation stick figures: d3-celestial (ofrohn) GeoJSON.
"""
import csv, io, json, math, os, re, sys, urllib.request

OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
os.makedirs(OUT, exist_ok=True)

HYG_URL = 'https://raw.githubusercontent.com/astronexus/HYG-Database/main/hyg/CURRENT/hygdata_v41.csv'
HYG_LOCAL = '/tmp/astro/hyg.csv'
MESSIER_URL = 'https://en.wikipedia.org/wiki/List_of_Messier_objects'
LINES_URL = 'https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/constellations.lines.json'
NAMES_URL = 'https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/constellations.json'

def fetch(url, local=None):
    if local and os.path.exists(local):
        with open(local, 'rb') as f:
            return f.read()
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()

# ── 1. stars ──────────────────────────────────────────────────
def build_stars():
    data = fetch(HYG_URL, HYG_LOCAL).decode('utf-8', errors='replace')
    rows = csv.DictReader(io.StringIO(data))
    out, n_named = [], 0
    for r in rows:
        try:
            mag = float(r['mag'])
        except (TypeError, ValueError):
            mag = 99
        proper = (r['proper'] or '').strip()
        # naked-eye stars, plus any with a proper name
        if mag > 6.5 and not proper:
            continue
        try:
            ra = float(r['ra']) * 15.0
        except (TypeError, ValueError):
            continue
        try:
            dec = float(r['dec'])
        except (TypeError, ValueError):
            continue
        if dec < -90 or dec > 90:
            continue
        hip = r['hip'].strip() or None
        dist = r['dist'].strip()
        dist_ly = round(float(dist) * 3.2616, 2) if dist and float(dist) > 0 else None
        spect = r['spect'].strip() or None
        bf = r['bf'].strip() or None
        if proper:
            n_named += 1
        out.append([
            int(hip) if hip else None,
            round(ra, 4), round(dec, 4), round(mag, 2),
            dist_ly, spect, proper or None, bf or None,
        ])
    out.sort(key=lambda s: s[3])  # brightest first
    return {'meta': {'count': len(out), 'source': 'HYG v4.1 (astronexus)', 'epoch': 'J2000'},
            'stars': out}

# ── 2. messier ────────────────────────────────────────────────
def parse_ra(s):
    s = (s or '').replace('\xa0', ' ').replace('\u2212', '-')
    m = re.search(r'(\d+)h\s*([\d.]+)m(?:\s*([\d.]+)s)?', s)
    if not m:
        return None
    h, mi, sec = m.group(1), m.group(2), m.group(3) or 0
    return round((int(h) + float(mi) / 60 + float(sec) / 3600) * 15, 4)

def parse_dec(s):
    s = (s or '').replace('\xa0', ' ').replace('\u2212', '-')
    m = re.match(r'\s*([+-]?)(\d+)°\s*(\d+)′(?:\s*([\d.]+)″?)?', s)
    if not m:
        return None
    sign = -1 if m.group(1) == '-' else 1
    deg = sign * (int(m.group(2)) + int(m.group(3)) / 60 + float(m.group(4) or 0) / 3600)
    return round(deg, 4)

def build_messier():
    html = fetch(MESSIER_URL).decode('utf-8', errors='replace')
    tables = None
    try:
        import pandas as pd
        tables = pd.read_html(io.StringIO(html))
    except Exception:
        pass
    if not tables:
        raise RuntimeError('could not parse Messier table')
    table = None
    for t in tables:
        cols = [str(c).replace('\xad', '').lower() for c in t.columns]
        if any('messier no' in c for c in cols):
            table = t
            break
    if table is None:
        raise RuntimeError('Messier table not found')
    # normalize column names (soft hyphens)
    cols = {i: str(c).replace('\xad', '').lower() for i, c in enumerate(table.columns)}
    def col(key):
        for i, c in cols.items():
            if c.startswith(key):
                return i
        return None
    i_m, i_ngc, i_name, i_type, i_dist, i_con, i_mag, i_dim, i_ra, i_dec = (
        col('messier'), col('ngc/ic'), col('common name'), col('object type'),
        col('dis'), col('con'), col('ap'), col('ap'), col('right'), col('declination'),
    )
    out = []
    for _, row in table.iterrows():
        def g(i):
            v = row.iloc[i] if i is not None else None
            return '' if v is None else str(v)
        m_raw = g(i_m)
        m = re.search(r'M(\d+)', m_raw)
        if not m:
            continue
        mnum = int(m.group(1))
        ngc = re.search(r'(NGC|IC)\s*(\d+)', g(i_ngc))
        name = g(i_name).strip().replace('\xad', '')
        obj_type = g(i_type).strip().replace('\xad', '')
        dist_raw = g(i_dist).strip().replace('\xad', '')
        dist = None
        dm = re.search(r'([\d.]+)', dist_raw)
        if dm and dm.group(1) != '0':
            try:
                dist = round(float(dm.group(1)), 2)
            except ValueError:
                dist = None
        con = g(i_con).strip().replace('\xad', '')
        mag_raw = g(i_mag).strip().replace('\xad', '')
        mag = None
        mm = re.search(r'([\d.]+)', mag_raw)
        if mm:
            try:
                mag = round(float(mm.group(1)), 1)
            except ValueError:
                pass
        ra, dec = parse_ra(g(i_ra)), parse_dec(g(i_dec))
        if ra is None or dec is None:
            continue
        out.append({
            'm': mnum,
            'ngc': ngc.group(2) if ngc else None,
            'name': name or None,
            'type': obj_type,
            'dist': dist,
            'con': con,
            'mag': mag,
            'ra': ra,
            'dec': dec,
        })
    out.sort(key=lambda x: x['m'])
    return {'meta': {'count': len(out), 'source': 'Wikipedia List of Messier objects'}, 'objects': out}

# ── 3. constellations ─────────────────────────────────────────
def build_constellations():
    lines = json.loads(fetch(LINES_URL).decode('utf-8'))
    names = json.loads(fetch(NAMES_URL).decode('utf-8'))
    name_map = {}
    for f in names['features']:
        p = f.get('properties', {})
        name_map[f['id']] = {'name': p.get('name') or p.get('en') or f['id'],
                             'desig': p.get('desig') or f['id']}
    out = []
    for f in lines['features']:
        cid = f['id']
        geom = f.get('geometry', {})
        segs = []
        pts = []
        if geom.get('type') == 'MultiLineString':
            for line in geom['coordinates']:
                seg = [[round(p[0], 3), round(p[1], 3)] for p in line]
                segs.append(seg)
                pts.extend(seg)
        elif geom.get('type') == 'LineString':
            seg = [[round(p[0], 3), round(p[1], 3)] for p in geom['coordinates']]
            segs.append(seg)
            pts.extend(seg)
        if not segs:
            continue
        # centre = mean of all points (for labels); wrap RA at 0/360
        ra_vals = [p[0] for p in pts]
        if max(ra_vals) - min(ra_vals) > 300:  # wraps across 0h
            ra_vals = [(v + 360 if v < 180 else v) for v in ra_vals]
        center = [round(sum(ra_vals) / len(ra_vals) % 360, 2),
                  round(sum(p[1] for p in pts) / len(pts), 2)]
        info = name_map.get(cid, {'name': cid, 'desig': cid})
        out.append({
            'id': cid,
            'name': info['name'],
            'desig': info['desig'],
            'center': center,
            'lines': segs,
        })
    out.sort(key=lambda c: c['desig'])
    return {'meta': {'count': len(out), 'source': 'd3-celestial (ofrohn)'}, 'constellations': out}

if __name__ == '__main__':
    stars = build_stars()
    with open(os.path.join(OUT, 'stars.json'), 'w') as f:
        json.dump(stars, f, separators=(',', ':'))
    print('stars:', stars['meta']['count'])
    messier = build_messier()
    with open(os.path.join(OUT, 'messier.json'), 'w') as f:
        json.dump(messier, f, separators=(',', ':'))
    print('messier:', messier['meta']['count'])
    cons = build_constellations()
    with open(os.path.join(OUT, 'constellations.json'), 'w') as f:
        json.dump(cons, f, separators=(',', ':'))
    print('constellations:', cons['meta']['count'])
