<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Skills\Exceptions\SkillConditionConflict;
use App\Skills\Values\SkillConditionRegistration;

/**
 * Every named condition type the installed domains and modules register, by key, with the owner that registered it.
 */
final readonly class ConditionRegistry
{
    /**
     * @param  array<string, SkillConditionRegistration>  $registrations
     * @param  array<string, string>  $owners  each key's owner name
     */
    private function __construct(
        private array $registrations,
        private array $owners,
    ) {}

    /**
     * @param  array<string, list<SkillConditionRegistration>>  $byOwner  each owner's registrations, by owner name
     *
     * @throws SkillConditionConflict when two owners register one key
     */
    public static function of(array $byOwner): self
    {
        $registrations = [];
        $owners = [];

        foreach ($byOwner as $owner => $ownRegistrations) {
            foreach ($ownRegistrations as $registration) {
                if (array_key_exists($registration->key, $registrations)) {
                    throw SkillConditionConflict::between($registration->key, $owners[$registration->key], $owner);
                }

                $registrations[$registration->key] = $registration;
                $owners[$registration->key] = $owner;
            }
        }

        return new self($registrations, $owners);
    }

    public function has(string $key): bool
    {
        return array_key_exists($key, $this->registrations);
    }

    /**
     * The registration of an installed key; callers ask has() first.
     */
    public function registration(string $key): SkillConditionRegistration
    {
        return $this->registrations[$key];
    }
}
