<?php

// Prints known when the local database still holds the enrolled host {{host}}, and gone when it does not.
echo App\Models\Host::query()->withoutGlobalScopes()->whereKey('{{host}}')->exists() ? 'known' : 'gone';
