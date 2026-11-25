<?php

declare(strict_types=1);

namespace App\Support\Inputs\Values;

use App\Enums\Files\FileOperation;
use App\Exceptions\UnreadablePayload;
use App\Values\Operation;

/**
 * The files one edit changes, in the order the driver changes them.
 */
final readonly class FileChanges
{
    private const string PATCH_FILE_LINE = '/^\*\*\* (Add|Update|Delete) File: (.+)$/m';

    private const string PATCH_MOVED_FILE = '/^\*\*\* Update File: (.+)\n\*\*\* Move to: (.+)$/m';

    /**
     * @param  list<FileChange>  $changes
     */
    public function __construct(public array $changes) {}

    /**
     * Every file a patch adds, updates or deletes, in the order the patch names them; a moved file is deleted at its
     * source and written at its destination.
     */
    public static function fromPatch(string $patch): self
    {
        preg_match_all(self::PATCH_FILE_LINE, $patch, $matches, PREG_SET_ORDER);

        if ($matches === []) {
            throw UnreadablePayload::forValue('patch', 'without a file');
        }

        preg_match_all(self::PATCH_MOVED_FILE, $patch, $moves, PREG_SET_ORDER);
        $movedSources = array_map(fn (array $move) => trim($move[1]), $moves);

        $changes = array_map(
            fn (array $match) => in_array(trim($match[2]), $movedSources, true)
                ? new FileChange(trim($match[2]), FileOperation::Delete)
                : new FileChange(trim($match[2]), FileOperation::fromPatchAction($match[1])),
            $matches,
        );

        $destinations = array_map(fn (array $move) => new FileChange(trim($move[2]), FileOperation::Write), $moves);

        return new self([
            ...$changes,
            ...$destinations,
        ]);
    }

    /**
     * @return list<string>
     */
    public function paths(): array
    {
        return array_map(fn (FileChange $change) => $change->path, $this->changes);
    }

    /**
     * Every change as an operation, so a policy judges the whole edit before any part of it runs.
     *
     * @return list<Operation>
     */
    public function operations(): array
    {
        return array_map(fn (FileChange $change): Operation => $change->asOperation(), $this->changes);
    }
}
