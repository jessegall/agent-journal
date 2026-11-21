<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Contracts\StartRecordResolver;
use App\Agents\Exceptions\StartRecordMissing;
use App\Agents\Models\StartRecord;
use App\Agents\Support\StartRecordDetails;

/**
 * Reads start records for the actor of this request: an agent sees only the starts of itself.
 */
final readonly class StartRecords implements StartRecordResolver
{
    public function __construct(private CurrentActor $actors) {}

    public function own(string $requestId): StartRecordDetails
    {
        $record = StartRecord::query()->forAgent($this->actors->actor()->id)->where('request_id', $requestId)->first();

        return $record !== null ? self::detailsOf($record) : throw StartRecordMissing::forRequest($requestId);
    }

    public function forOwnerReference(string $reference): array
    {
        $this->actors->actor();

        return array_values(StartRecord::query()->forOwnerReference($reference)->orderByDesc('id')->readExactly(
            self::MOST_PER_OWNER,
        )->get()
            ->map(fn (StartRecord $record) => self::detailsOf($record))
            ->all());
    }

    private static function detailsOf(StartRecord $record): StartRecordDetails
    {
        return new StartRecordDetails(
            $record->request_id,
            $record->agent_id,
            $record->driver,
            $record->model,
            $record->requested_model_type,
            $record->requested_model,
            $record->driver_source,
            $record->origin_type,
            $record->owner_reference,
            $record->conversation_mode,
            $record->disposition,
            $record->session_id,
        );
    }
}
