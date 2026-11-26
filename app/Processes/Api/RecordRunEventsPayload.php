<?php

declare(strict_types=1);

namespace App\Processes\Api;

use App\Attributes\Api\Endpoint;
use App\Attributes\Api\InPath;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Values\RunEvent;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\FromRouteParameterProperty;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;

/**
 * Sends a batch of a run's spooled events in order, under the run's event key; the host sends what is left again on
 * its next turn, and the journal applies each sequence number once.
 *
 * @implements ApiPayload<RunEventsAccepted>
 */
#[Endpoint('processes/runs/{processRun}/events', 'POST', RunEventsAccepted::class, ApiEffect::SequencedWrite)]
final class RecordRunEventsPayload extends Data implements ApiPayload
{
    /**
     * @param  list<RunEvent>  $events
     */
    public function __construct(
        #[InPath, FromRouteParameterProperty('processRun', 'id')]
        public readonly string $processRun,
        #[MapName('key'), Size(64)]
        public readonly string $eventKey,
        #[DataCollectionOf(RunEvent::class), Min(1), Max(500)]
        public readonly array $events,
    ) {}
}
