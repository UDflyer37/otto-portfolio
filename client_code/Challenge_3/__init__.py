from ._anvil_designer import Challenge_3Template
from anvil import *
import anvil.server


class Challenge_3(Challenge_3Template):
  def __init__(self, **properties):
    # Set Form properties and Data Bindings.
    self.init_components(**properties)
    self.dom_nodes['submit_c3'].addEventListener('click', self._submit_c3_click)
    
  def _submit_c3_click(self, event):
    # Prevent default form submission
    event.preventDefault()
    
    key = self.dom_nodes['key_c3'].value
    results = anvil.server.call_s('key_check_c3', key)
    anvil.alert(content=results, buttons="Close")
