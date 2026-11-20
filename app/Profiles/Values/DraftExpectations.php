<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Exceptions\ProfileDraftRefused;

final readonly class DraftExpectations
{
    /** @param array<string, int> $revisions */
    public function __construct(public array $revisions = []) {}

    /** @param list<string> $options */
    public static function fromOptions(array $options): self
    {
        $revisions = [];

        foreach ($options as $option) {
            $parts = explode('=', $option, 2);
            $key = ProfileKey::from($parts[0]);
            $revision = $parts[1] ?? '';

            if (! ctype_digit($revision) || array_key_exists($key->key, $revisions)) {
                throw ProfileDraftRefused::invalidExpectation($option);
            }

            $revisions[$key->key] = (int) $revision;
        }

        return new self($revisions);
    }

    public function revisionOf(ProfileKey $profile): int
    {
        return $this->revisions[$profile->key] ?? 0;
    }
}
