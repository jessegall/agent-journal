<?php

declare(strict_types=1);

namespace Domain\Sequences\Providers;

use App\Support\LinkTypeRegistry;
use Domain\Sequences\Models\SequenceRun;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Sequences's own models.
 */
final class SequencesServiceProvider extends ServiceProvider
{
    public function boot(LinkTypeRegistry $links): void
    {
        $links->register([
            'sequences.sequence-run' => SequenceRun::class,
        ]);
    }
}
