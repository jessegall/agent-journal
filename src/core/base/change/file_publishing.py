from core.base.change.journal_booting import JournalBooting
from core.base.change.registry_synced import RegistrySynced

FilePublishing = JournalBooting | RegistrySynced
