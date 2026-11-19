<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Skills\Exceptions\SkillSelectionConflict;
use App\Skills\Values\ExcludedSkill;
use App\Skills\Values\SelectedSkills;
use App\Skills\Values\SkillContext;
use App\Skills\Values\SkillEntry;

/**
 * Selects the skills of one context: only skills whose condition matches, narrowed by the launch profile's allowlist
 * (absent keeps all, empty keeps none). Every skill the profile requires must be selected, or the launch is refused.
 * A profile never makes a skill eligible that its condition does not match.
 */
final readonly class SkillSelection
{
    /**
     * @param  list<SkillEntry>  $skills
     *
     * @throws SkillSelectionConflict when a required skill is not selected
     */
    public function select(array $skills, SkillContext $context): SelectedSkills
    {
        $snapshot = $context->profile->snapshot;
        $allowlist = $snapshot?->skillAllowlist;
        $selected = [];
        $excluded = [];

        foreach ($skills as $skill) {
            $result = $skill->condition->evaluate($context);
            $reason = match (true) {
                ! $result->isMatch() => $result->outcome->value.':'.$result->reason,
                $allowlist !== null && ! in_array($skill->key->key, $allowlist, true) => 'not-in-allowlist',
                default => null,
            };

            if ($reason === null) {
                $selected[] = $skill;
            } else {
                $excluded[$skill->key->key] = new ExcludedSkill($skill->key, $reason);
            }
        }

        foreach ($context->profile->requiredSkills() as $required) {
            if (! in_array($required, array_map(fn (SkillEntry $skill) => $skill->key->key, $selected), true)) {
                throw SkillSelectionConflict::requiredNotSelected($required, isset($excluded[$required]) ? $excluded[$required]->reason : 'not-in-catalogue');
            }
        }

        return new SelectedSkills($selected, array_values($excluded), $this->digestOf($selected, $context));
    }

    /**
     * @param  list<SkillEntry>  $selected
     */
    private function digestOf(array $selected, SkillContext $context): string
    {
        return hash('sha256', (string) json_encode([
            'session' => $context->sessionId,
            'environment' => $context->environment,
            'profile' => $context->profile->revisionText(),
            'program' => $context->program?->key,
            'provider' => $context->provider?->key,
            'skills' => array_map(fn (SkillEntry $skill) => [
                $skill->key->key,
                $skill->rendered->digest,
                $skill->condition->toArray(),
            ], $selected),
        ], JSON_THROW_ON_ERROR));
    }
}
