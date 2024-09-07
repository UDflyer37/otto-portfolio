import anvil.email
import anvil.server
from datetime import datetime
from zoneinfo import ZoneInfo

@anvil.server.callable
def send_email(name, email, message):
  utc_now = datetime.now().astimezone(ZoneInfo("UTC"))
  eastern_time = utc_now.astimezone(ZoneInfo("America/New_York"))

  anvil.email.send(from_name="Otto Portfolio Contact",
                   to="ottoa98@gmail.com",
                   subject=f"New Message from {name}: {eastern_time.strftime('%A %d %b %Y at %I:%M %p')}",
                   text=f"{name} ({email}) sent you a message: {message}")