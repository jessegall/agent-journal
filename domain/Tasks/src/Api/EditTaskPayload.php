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
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\RequiredWithout;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Changes a task's title or brief, as the revision its caller read.
 *
 * @implements ApiPayload<TaskEdited>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('tasks/edit', 'POST', TaskEdited::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class EditTaskPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Ulid]
        public string $taskId,
        #[Min(1)]
        public int $expectedRevision,
        #[Max(Task::TITLE_CHARACTER_LIMIT), RequiredWithout('brief')]
        public string|null $title,
        #[Max(Task::NOTE_CHARACTER_LIMIT), RequiredWithout('title')]
        public string|null $brief,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
