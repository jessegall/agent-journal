<?php

declare(strict_types=1);

namespace App\Support\Bootstrappers;

use App\Contracts\Domains\DomainBootstrapper;
use App\Navigation\Contracts\DraftProducerProvider;
use App\Support\DomainEntry;
use App\Support\DraftProducers;

/**
 * Registers the draft producers a domain declares, so its nouns offer guided creation; a noun claimed twice is refused.
 */
final readonly class DraftProducersBootstrapper implements DomainBootstrapper
{
    public function __construct(private DraftProducers $producers) {}

    public function __invoke(DomainEntry $domain): void
    {
        if (! $domain->domain instanceof DraftProducerProvider) {
            return;
        }

        foreach ($domain->domain->draftProducers() as $noun => $class) {
            $this->producers->register($noun, $class);
        }
    }
}
