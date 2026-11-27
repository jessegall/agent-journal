<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Domain\Tasks\Models\Task;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Files a new open task.
 *
 * @implements ApiPayload<TaskNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('tasks/create', 'POST', TaskNamed::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class CreateTaskPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(Task::TITLE_CHARACTER_LIMIT)]
        public readonly string $title,
        #[Max(Task::NOTE_CHARACTER_LIMIT)]
        public readonly string $brief,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
    ) {}
}
