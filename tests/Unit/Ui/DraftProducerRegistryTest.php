<?php

declare(strict_types=1);

namespace Tests\Unit\Ui;

use App\Exceptions\DraftProducerMissing;
use App\Exceptions\DraftProducerRepeated;
use App\Support\DraftProducerRegistry;
use Tests\Fixtures\UiDeclarations\StubDraftProducer;
use Tests\TestCase;

/**
 * Guided creation is offered only for a noun with a registered draft producer, and a producer runs only on the answers.
 */
final class DraftProducerRegistryTest extends TestCase
{
    public function test_with_no_producer_registered_no_noun_offers_guided_creation(): void
    {
        $producers = new DraftProducerRegistry();

        $this->assertFalse($producers->offersGuided('task'));
        $this->assertThrows(fn () => $producers->producerFor('task'), DraftProducerMissing::class);
    }

    public function test_a_registered_producer_drafts_from_answers_and_a_noun_takes_only_one(): void
    {
        $producers = new DraftProducerRegistry();
        $producers->register('task', StubDraftProducer::class);

        $draft = $producers->producerFor('task')->draft(['Ship it', 'Soon', 'Yes']);

        $this->assertTrue($producers->offersGuided('task'));
        $this->assertCount(3, $producers->producerFor('task')->questions());
        $this->assertSame(['title' => 'Ship it'], $draft->fields);
        $this->assertSame(StubDraftProducer::AGENT, $draft->agent);

        $this->assertThrows(
            fn () => $producers->register('task', StubDraftProducer::class),
            DraftProducerRepeated::class,
        );
    }
}
