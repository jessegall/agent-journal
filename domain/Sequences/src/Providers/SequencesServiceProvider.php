<?php

declare(strict_types=1);

namespace Domain\Sequences\Providers;

use App\Support\LinkTypeRegistry;
use App\Support\Sources\Contracts\DockRegistration;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Support\SequenceRunDocking;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Sequences's own models, and a run as a record its chat lines show.
 */
final class SequencesServiceProvider extends ServiceProvider
{
    public function boot(LinkTypeRegistry $links, DockRegistration $docks): void
    {
        $links->register([
            SequenceRun::LINK_TYPE => SequenceRun::class,
        ]);

        $docks->register(SequenceRun::LINK_TYPE, SequenceRun::class, SequenceRunDocking::class);
    }
}
