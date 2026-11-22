<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Concerns;

use App\Contracts\Files;
use App\Exceptions\FileMissing;
use App\Exceptions\FileUnreadable;

/**
 * Reads the text of a new document or report from exactly one of --body, --body - (standard input) or --file, read
 * here on the agent's side: the server never opens a path. A file in a private place is refused (FolderClosed).
 */
trait ReadsRecordBody
{
    protected function bodyText(Files $files): string|null
    {
        $body = $this->option('body');
        $file = $this->option('file');

        if (is_string($body) === is_string($file)) {
            return null;
        }

        if (is_string($file)) {
            try {
                return $files->readNamed($file);
            } catch (FileMissing|FileUnreadable) {
                return null;
            }
        }

        return $body === '-' ? (string) stream_get_contents(STDIN) : $body;
    }
}
