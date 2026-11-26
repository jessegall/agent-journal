<?php

declare(strict_types=1);

/**
 * Writes _ide_helper_scopes.php, an IDE-only file that lists every model's query scopes on the builders the models
 * query through, so the IDE resolves $query->withSource() on a builder as it does on the model.
 *
 *   php -d memory_limit=1G tools/model-docs/scope-stubs.php
 */

use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Values\FilePath;
use Illuminate\Contracts\Console\Kernel;
use Tools\ModelDocs\ScopeStubs;

require __DIR__.'/../../vendor/autoload.php';

$app = require __DIR__.'/../../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$files = $app->make(Files::class);
$stubs = ScopeStubs::of($files, config('ide-helper.model_locations'));
$files->write(FilePath::in(Place::Project, '_ide_helper_scopes.php'), $stubs->file());
echo "Wrote _ide_helper_scopes.php: {$stubs->scopeCount()} scopes on {$stubs->builderCount()} builders.\n";
