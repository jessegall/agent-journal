<?php

declare(strict_types=1);

namespace App\Connections\Data;

use App\Connections\Enums\FileWindowStatus;
use App\Web\Creation\Exceptions\MissingFields;

final class FilePaneDataFields
{
    private string $path;

    private FileWindowStatus $status;

    /** @var list<string> */
    private array $lines;

    private bool $isTruncated;

    private string $fullUrl;

    public function path(string $path): self
    {
        $this->path = $path;

        return $this;
    }

    public function status(FileWindowStatus $status): self
    {
        $this->status = $status;

        return $this;
    }

    /** @param list<string> $lines */
    public function lines(array $lines): self
    {
        $this->lines = $lines;

        return $this;
    }

    public function isTruncated(bool $isTruncated): self
    {
        $this->isTruncated = $isTruncated;

        return $this;
    }

    public function fullUrl(string $fullUrl): self
    {
        $this->fullUrl = $fullUrl;

        return $this;
    }

    public function finish(): FilePaneData
    {
        if (! isset($this->path)) {
            throw MissingFields::forType(FilePaneData::class, 'path');
        }

        if (! isset($this->status)) {
            throw MissingFields::forType(FilePaneData::class, 'status');
        }

        if (! isset($this->lines)) {
            throw MissingFields::forType(FilePaneData::class, 'lines');
        }

        if (! isset($this->isTruncated)) {
            throw MissingFields::forType(FilePaneData::class, 'isTruncated');
        }

        if (! isset($this->fullUrl)) {
            throw MissingFields::forType(FilePaneData::class, 'fullUrl');
        }

        return new FilePaneData(
            path: $this->path,
            status: $this->status,
            lines: $this->lines,
            isTruncated: $this->isTruncated,
            fullUrl: $this->fullUrl,
        );
    }
}
