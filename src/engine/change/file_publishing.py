from engine.change.journal_booting import JournalBooting
from engine.change.registry_synced import RegistrySynced

FilePublishing = JournalBooting | RegistrySynced
