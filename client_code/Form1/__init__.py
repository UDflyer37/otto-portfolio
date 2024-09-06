from ._anvil_designer import Form1Template
from anvil import *
from anvil.js.window import 
import anvil.js


class Form1(Form1Template):
  def __init__(self, **properties):
    # Set Form properties and Data Bindings.
    self.init_components(**properties)
    send=self.dom_nodes['send']
    text=self.dom_nodes['text']
    message=self.dom_nodes['message']
    
    self.dom_nodes['send'].addEventListener('click', self._send_click)

  def _send_click(self, **event_args):
    self.raise_event('click')
    print("this button was clicked")
    
      

    # Any code you write here will run before the form opens.
