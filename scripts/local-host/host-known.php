<?php

declare(strict_types=1);

use App\Models\Host;

// Prints known when the local database still holds the enrolled host {{host}}, and gone when it does not.
echo Host::query()->withoutGlobalScopes()->whereKey('{{host}}')->exists() ? 'known' : 'gone';
