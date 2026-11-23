<?php

declare(strict_types=1);

namespace App\Contracts\Navigation;

/**
 * A domain that offers guided creation: for each noun it creates, the producer that asks its questions and drafts it.
 */
interface DraftProducerProvider
{
    /**
     * @return array<string, class-string<DraftProducer>>
     */
    public function draftProducers(): array;
}
