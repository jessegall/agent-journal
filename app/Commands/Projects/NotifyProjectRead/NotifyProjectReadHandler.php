<?php

declare(strict_types=1);

namespace App\Commands\Projects\NotifyProjectRead;

use App\Contracts\Bus\CommandHandler;
use App\Data\Connections\ProjectEntryData;
use App\Enums\Projects\ProjectReadType;
use App\Exceptions\ProjectReadRefused;
use App\Models\Projects\ProjectFile;
use App\Models\Projects\ProjectFileVersion;
use App\Models\Projects\ProjectRead;
use App\Values\ProjectFileText;

/**
 * Settles a read with its host's answer once the journal has checked every bound again, never trusting the host.
 */
final readonly class NotifyProjectReadHandler implements CommandHandler
{
    /**
     * @throws ProjectReadRefused
     */
    public function handle(NotifyProjectReadCommand $command): void
    {
        $read = ProjectRead::findLockedById($command->readId);

        if (! $read->isOfHost($command->hostId)) {
            throw ProjectReadRefused::ofAnotherActor($read->id);
        }

        if ($read->isExpired()) {
            return;
        }

        if ($read->isSettled()) {
            throw ProjectReadRefused::settled($read->id);
        }

        if ($command->failure !== null) {
            $read->fail($command->failure);

            return;
        }

        if ($read->type === ProjectReadType::Directory) {
            $read->answerWithEntries($this->checkedEntries($read->id, $command->entries), $command->isTruncated);

            return;
        }

        $text = $this->checkedText($read->id, $command->text);
        $read->answerWithText($text, $command->isTruncated);

        if (! $command->isTruncated) {
            $file = ProjectFile::findAtPath($read->binding_id, $read->path)
                ->getOrCall(fn () => ProjectFile::create($read->binding, $read->path));

            $file->versionWith($text->digest)
                ->getOrCall(fn () => ProjectFileVersion::create($file, $text->digest, $text->text));
        }
    }

    /**
     * @param  list<ProjectEntryData>  $entries
     * @return list<ProjectEntryData>
     *
     * @throws ProjectReadRefused
     */
    private function checkedEntries(string $readId, array $entries): array
    {
        if (count($entries) > ProjectRead::DIRECTORY_ENTRY_LIMIT) {
            throw ProjectReadRefused::tooManyEntries($readId, ProjectRead::DIRECTORY_ENTRY_LIMIT);
        }

        foreach ($entries as $entry) {
            if ($entry->name === '' || str_contains($entry->name, '/') || str_contains($entry->name, "\0")) {
                throw ProjectReadRefused::entryName($readId);
            }
        }

        return $entries;
    }

    /**
     * @throws ProjectReadRefused
     */
    private function checkedText(string $readId, ProjectFileText|null $text): ProjectFileText
    {
        if ($text === null) {
            throw ProjectReadRefused::withoutAnswer($readId);
        }

        if (strlen($text->text) > ProjectRead::FILE_TEXT_BYTE_LIMIT) {
            throw ProjectReadRefused::textTooLong($readId, ProjectRead::FILE_TEXT_BYTE_LIMIT);
        }

        if (! mb_check_encoding($text->text, 'UTF-8')) {
            throw ProjectReadRefused::textNotUtf8($readId);
        }

        if (preg_match('/\A[0-9a-f]{64}\z/', $text->digest) !== 1) {
            throw ProjectReadRefused::digest($readId);
        }

        return $text;
    }
}
