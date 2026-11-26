<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Exceptions\ProfileDraftRefused;
use App\Values\ProfileKey;

final readonly class DraftExpectations
{
    /**
     * @param  list<ExpectedDraftRevision>  $revisions
     */
    public function __construct(public array $revisions = []) {}

    /**
     * @param  list<string>  $options
     */
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

            $revisions[$key->key] = new ExpectedDraftRevision($key, (int) $revision);
        }

        return new self(array_values($revisions));
    }

    public function revisionOf(ProfileKey $profile): int
    {
        foreach ($this->revisions as $expected) {
            if ($expected->profile->key === $profile->key) {
                return $expected->revision;
            }
        }

        return 0;
    }
}
