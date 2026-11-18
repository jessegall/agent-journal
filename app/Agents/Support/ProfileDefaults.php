<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Programs\Enums\HookProgram;

/**
 * What a profile decides about a launch, as plain values from its owner: its program (pinned or open), its default
 * model and the models it allows; an empty allowed list allows any model.
 */
final readonly class ProfileDefaults
{
    /**
     * @param  list<string>  $allowedModels
     */
    public function __construct(
        public string $key,
        public int $revision,
        public HookProgram|null $program,
        public bool $programPinned,
        public string|null $defaultModel,
        public array $allowedModels,
    ) {}

    public function allows(string $model): bool
    {
        return $this->allowedModels === [] || in_array($model, $this->allowedModels, true);
    }
}
