<?php

declare(strict_types=1);

namespace App\Agents\Values;

use JsonSerializable;

/**
 * The file whose presence makes a healed process run its restart argv instead of its first: a file named by the glob
 * anywhere under the folder, such as the transcript of the conversation the restart resumes.
 */
final readonly class RestartFile implements JsonSerializable
{
    public function __construct(public string $folder, public string $glob) {}

    /**
     * @return array{folder: string, glob: string}
     */
    public function jsonSerialize(): array
    {
        return [
            'folder' => $this->folder,
            'glob' => $this->glob,
        ];
    }
}
