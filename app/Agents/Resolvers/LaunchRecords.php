<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Contracts\LaunchRecordResolver;
use App\Agents\Exceptions\LaunchRecordMissing;
use App\Agents\Models\LaunchRecord;
use App\Agents\Support\LaunchRecordDetails;

/**
 * Reads launch records for the actor of this request: an agent sees only the launches of itself.
 */
final readonly class LaunchRecords implements LaunchRecordResolver
{
    public function __construct(private CurrentActor $actors) {}

    public function own(string $requestId): LaunchRecordDetails
    {
        $record = LaunchRecord::query()->forAgent($this->actors->actor()->id)->where('request_id', $requestId)->first();

        return $record !== null ? self::detailsOf($record) : throw LaunchRecordMissing::forRequest($requestId);
    }

    public function forOwnerReference(string $ownerReference): array
    {
        $this->actors->actor();

        return array_values(LaunchRecord::query()->forOwnerReference($ownerReference)->orderByDesc('id')->readLimit(self::MOST_PER_OWNER)->get()
            ->map(fn (LaunchRecord $record) => self::detailsOf($record))
            ->all());
    }

    private static function detailsOf(LaunchRecord $record): LaunchRecordDetails
    {
        return new LaunchRecordDetails(
            $record->request_id,
            $record->agent_id,
            $record->program,
            $record->model,
            $record->requested_model_type,
            $record->requested_model,
            $record->program_source,
            $record->origin_type,
            $record->owner_reference,
            $record->conversation_mode,
            $record->disposition,
            $record->session_id,
        );
    }
}
