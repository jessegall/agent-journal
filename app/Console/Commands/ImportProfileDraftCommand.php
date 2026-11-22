<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\DecodesAnyJson;
use App\Commands\SaveProfileDraft\SaveProfileDraftCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Files\Files;
use App\Exceptions\FileMissing;
use App\Exceptions\FileUnreadable;
use App\Exceptions\ProfileDraftRefused;
use App\Support\ConsoleOwner;
use App\Values\DraftExpectations;
use App\Values\ProfileKey;
use App\Values\ScriptSource;
use Illuminate\Console\Command;
use JsonException;

final class ImportProfileDraftCommand extends Command
{
    protected $signature = 'profile:draft-import {profile} {source} {commands} {expected}';

    protected $description = 'Save script text and command definitions from local files into a shared draft';

    public function handle(ConsoleOwner $owner, CommandBus $commands, Files $files): int
    {
        $owner->actAsOwner();
        $profile = ProfileKey::from((string) $this->argument('profile'));
        $expected = DraftExpectations::fromOptions([$profile->key.'='.(string) $this->argument('expected')]);
        $source = self::read($files, (string) $this->argument('source'));
        $definitions = self::readCommands($files, (string) $this->argument('commands'));

        $revision = $commands->run(new SaveProfileDraftCommand(
            $profile,
            $expected->revisionOf($profile),
            ScriptSource::fromDefinitions($source, $definitions),
        ));

        $this->line("{$profile}: draft revision {$revision}");

        return self::SUCCESS;
    }

    private static function read(Files $files, string $path): string
    {
        try {
            $contents = $files->readNamedAtMost($path, ScriptSource::BYTE_LIMIT + 1);
        } catch (FileMissing|FileUnreadable $failure) {
            throw ProfileDraftRefused::unreadable($path, $failure);
        }

        if (strlen($contents) > ScriptSource::BYTE_LIMIT) {
            throw ProfileDraftRefused::oversized();
        }

        return $contents;
    }

    /**
     * The command definitions in the file the user names, sent on as written for the journal to check one by one.
     *
     * @return array<string, mixed>
     */
    #[DecodesAnyJson]
    private static function readCommands(Files $files, string $path): array
    {
        try {
            $contents = json_decode(self::read($files, $path), true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $failure) {
            throw ProfileDraftRefused::unreadable($path, $failure);
        }

        if (! is_array($contents)) {
            throw ProfileDraftRefused::unreadable($path);
        }

        return $contents;
    }
}
