// Tinker's input, so it opens with no PHP tag: prints known when the local database still holds the enrolled host
// {{host}}, and gone when it does not.
use App\Models\Projects\Host;

echo Host::query()->withoutGlobalScopes()->whereKey('{{host}}')->exists() ? 'known' : 'gone';
