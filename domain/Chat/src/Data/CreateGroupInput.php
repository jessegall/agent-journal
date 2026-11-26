<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A new group chat: its title and the users it starts with.
 */
#[TypeScript]
final class CreateGroupInput extends Data
{
    /**
     * @param  list<string>  $userIds
     */
    public function __construct(
        #[Regex('/\\S/'), Max(120)]
        public readonly string $title,
        public readonly array $userIds,
    ) {}

    /**
     * The users may be none: the owner starts a group alone and adds people later.
     *
     * @return array<string, list<string>>
     */
    public static function rules(): array
    {
        return [
            'userIds' => [
                'present',
                'array',
                'max:99',
            ],
            'userIds.*' => ['string'],
        ];
    }
}
