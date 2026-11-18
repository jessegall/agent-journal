<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Concerns;

/**
 * Reads the text of a new document or report from exactly one of --body, --body - (standard input) or --file, read
 * here on the agent's side: the server never opens a path.
 */
trait ReadsRecordBody
{
    protected function bodyText(): string|null
    {
        $body = $this->option('body');
        $file = $this->option('file');

        if (is_string($body) === is_string($file)) {
            return null;
        }

        if (is_string($file)) {
            return is_readable($file) ? (string) file_get_contents($file) : null;
        }

        return $body === '-' ? (string) stream_get_contents(STDIN) : $body;
    }
}
