from engine.event.journal_booting import JournalBooting
from engine.event.registry_synced import RegistrySynced

FilePublishing = JournalBooting | RegistrySynced
