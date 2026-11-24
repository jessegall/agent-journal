<?php

declare(strict_types=1);

namespace Domain\Helpers\Data;

use Domain\Helpers\Values\HelperReceipt;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A dispatch receipt as a signed call answers it: the identity and job, the profile type and revision, the
 * conversation asked for and why, and the requested and resolved model with the actual model as the adapter reports
 * it. It names no session.
 */
#[MapName(SnakeCaseMapper::class)]
final class HelperReceiptData extends Data
{
    public function __construct(
        public string $identityId,
        public string $jobId,
        public bool $isNewJob,
        public bool $isNewIdentity,
        public string $profileType,
        public int $profileRevision,
        public string $state,
        public string $conversationMode,
        public string $conversationReason,
        public bool $independent,
        public string $launchReference,
        public string $driver,
        public string $requestedModelType,
        public string|null $requestedModel,
        public string $resolvedModel,
        public string $actualModel,
        public string $executionMode,
        public bool $newSession,
    ) {}

    public static function fromHelperReceipt(HelperReceipt $receipt): self
    {
        $launch = $receipt->launch;
        $start = $receipt->start;
        $selection = $start->selection;
        $requested = $selection->requested;

        return self::from([
            'identityId' => $receipt->identityId,
            'jobId' => $receipt->jobId,
            'isNewJob' => $receipt->isNewJob,
            'isNewIdentity' => $launch->isNewIdentity,
            'profileType' => $receipt->profileType,
            'profileRevision' => $launch->profileRevision,
            'state' => $receipt->state->value,
            'conversationMode' => $launch->conversationMode->value,
            'conversationReason' => $launch->conversationReason,
            'independent' => $launch->isIndependent,
            'launchReference' => $start->launchReference,
            'driver' => $selection->driver,
            'requestedModelType' => $requested->type->value,
            'requestedModel' => $requested->model,
            'resolvedModel' => $selection->model,
            'actualModel' => $start->actualModel,
            'executionMode' => $start->executionMode->value,
            'newSession' => $start->isNewSession,
        ]);
    }
}
