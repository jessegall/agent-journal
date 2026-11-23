<?php

declare(strict_types=1);

namespace App\Support\Readers;

use App\Contracts\Scripts\ScriptChecks;
use App\Data\ProfileDraftData;
use App\Models\Profiles\ProfileDraft;
use App\Values\ProfileKey;
use App\Values\ScriptSource;

/**
 * Reads a profile's shared draft with what checking it finds now, the same for the editor, the CLI and MCP.
 */
final readonly class ProfileDraftReader
{
    public function __construct(private ScriptChecks $checks) {}

    public function draft(ProfileKey $profile): ProfileDraftData
    {
        $draft = ProfileDraft::of($profile);

        return $this->checked($profile->key, $draft->revision, $draft->sourceAt($draft->revision));
    }

    /**
     * Checks source that may not be saved yet, as the draft at the given revision would hold it.
     */
    public function checked(string $profile, int $revision, ScriptSource $source): ProfileDraftData
    {
        return ProfileDraftData::fromCheck($profile, $revision, $source, $this->checks->check($source));
    }
}
