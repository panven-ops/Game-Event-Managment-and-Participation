from datetime import datetime, timezone

def winner_rate(p):

    if not p.last_win_at:
        return 1.0

    days_since = (datetime.now(timezone.utc) - p.last_win_at).days

    return 1/ (1 + p.win_count * 2) * (1 + days_since * 0.1)
