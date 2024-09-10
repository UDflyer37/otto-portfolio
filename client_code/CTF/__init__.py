from ._anvil_designer import CTFTemplate
from anvil import *
import anvil.server
import anvil.js.window
from ..Challenge_3 import Challenge_3


class CTF(CTFTemplate):
  def __init__(self, **properties):
    # Set Form properties and Data Bindings.
    self.init_components(**properties)
    anvil.js.window.scrollTo(0, 0)
    self.dom_nodes['challenge_3'].addEventListener('click', self._challenge_3_click)

  def _challenge_3_click(self, event):
    # Prevent default form submission
    event.preventDefault()
    anvil.alert(Challenge_3(), large=True, buttons="Close")