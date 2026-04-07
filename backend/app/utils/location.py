import math

def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    Returns distance in meters.
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a)) 
    r = 6371000 # Radius of earth in meters
    return c * r

def is_within_range(lecturer_lat, lecturer_lng, student_lat, student_lng, max_radius_meters=50):
    if not all(v is not None for v in [lecturer_lat, lecturer_lng, student_lat, student_lng]):
        return False
    distance = haversine(lecturer_lat, lecturer_lng, student_lat, student_lng)
    return distance <= max_radius_meters
