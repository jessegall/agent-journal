<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\ProgramSourceType;
use App\Agents\Exceptions\DefaultUnavailable;
use App\Agents\Exceptions\ModelUnavailable;
use App\Agents\Exceptions\ProgramConflict;
use App\Agents\Exceptions\ProgramRequired;
use App\Agents\Exceptions\ProgramUnsupported;
use App\Programs\Enums\HookProgram;

/**
 * The program and concrete model a launch runs, the model selection it asked for and where the program came from.
 */
final readonly class SelectedProgram
{
    public function __construct(
        public HookProgram $program,
        public string $model,
        public ModelSelection $requested,
        public SelectionSource $source,
    ) {}

    /**
     * The same selection pinned to a profile, for a launch whose selection named none.
     */
    public function pinnedTo(string $profileKey, int $profileRevision): self
    {
        $source = new SelectionSource($this->source->programSource, $profileKey, $profileRevision);

        return new self($this->program, $this->model, $this->requested, $source);
    }

    /**
     * Applies D7: a program the caller names wins unless the profile pins another, then the profile's program, then
     * the parent session's; the default model comes from the profile, and a named one must be allowed by it.
     *
     * @throws ProgramRequired
     * @throws ProgramConflict
     * @throws ProgramUnsupported
     * @throws DefaultUnavailable
     * @throws ModelUnavailable
     */
    public static function resolve(
        string|null $programKey,
        ModelSelection $requested,
        ProfileDefaults|null $profile,
        string|null $parentProgram,
    ): self {
        [$program, $programSource] = self::program($programKey, $profile, $parentProgram);
        $source = new SelectionSource($programSource, $profile?->key, $profile?->revision);

        return new self($program, self::model($requested, $profile, $program), $requested, $source);
    }

    /**
     * @return array{0: HookProgram, 1: ProgramSourceType}
     *
     * @throws ProgramRequired
     * @throws ProgramConflict
     * @throws ProgramUnsupported
     */
    private static function program(
        string|null $programKey,
        ProfileDefaults|null $profile,
        string|null $parentProgram,
    ): array {
        if ($programKey !== null) {
            $program = self::supported($programKey);

            if ($profile !== null && $profile->programPinned && $profile->program !== $program) {
                throw ProgramConflict::for($profile->key, $program->value);
            }

            return [$program, ProgramSourceType::Explicit];
        }

        if ($profile?->program !== null) {
            return [$profile->program, ProgramSourceType::Profile];
        }

        if ($parentProgram !== null) {
            return [self::supported($parentProgram), ProgramSourceType::ParentSession];
        }

        throw ProgramRequired::forLaunch();
    }

    /**
     * @throws DefaultUnavailable
     * @throws ModelUnavailable
     */
    private static function model(
        ModelSelection $requested,
        ProfileDefaults|null $profile,
        HookProgram $program,
    ): string {
        $model = $requested->model;

        if ($model === null) {
            return $profile->defaultModel ?? throw DefaultUnavailable::forLaunch();
        }

        if ($profile !== null && ! $profile->allows($model)) {
            throw ModelUnavailable::for($model, $program->value);
        }

        return $model;
    }

    /**
     * @throws ProgramUnsupported
     */
    private static function supported(string $programKey): HookProgram
    {
        return HookProgram::tryFrom($programKey) ?? throw ProgramUnsupported::for($programKey);
    }
}
