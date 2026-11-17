<?php

declare(strict_types=1);

namespace App\Domain\Sequences\Providers;

use App\Core\Links\Support\LinkTypes;
use App\Domain\Sequences\Models\SequenceRun;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Sequences's own models.
 */
final class SequencesServiceProvider extends ServiceProvider
{
    public function boot(LinkTypes $links): void
    {
        $links->register([
            'sequences.sequence-run' => SequenceRun::class,
        ]);
    }
}
