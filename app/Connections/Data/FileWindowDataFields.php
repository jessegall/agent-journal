<?php

declare(strict_types=1);

namespace App\Connections\Data;

use App\Connections\Enums\FileWindowStatus;
use App\Connections\Layout\LayoutBodyData;
use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Optional;

final class FileWindowDataFields
{
    private FileWindowStatus $status;

    private string $name;

    private string $path;

    private bool $isMarkdown;

    /** @var list<string> */
    private array $lines;

    /** @var list<int> */
    private array $cutLineNumbers;

    private bool $isTruncated;

    private bool $hasDigest = false;

    private string|null $digest;

    private bool $hasSize = false;

    private int|null $size;

    private bool $hasCommentTarget = false;

    private string|null $commentTarget;

    /** @var list<FileThreadData> */
    private array $threads;

    private bool $hasRecipientId = false;

    private string|null $recipientId;

    private bool $hasRecipientName = false;

    private string|null $recipientName;

    private bool $hasCommentAddress = false;

    private string|null $commentAddress;

    private bool $hasTellAddress = false;

    private string|null $tellAddress;

    private LayoutBodyData|Optional $markdown;

    public function __construct()
    {
        $this->markdown = new Optional();
    }

    public function status(FileWindowStatus $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function name(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function path(string $path): self
    {
        $this->path = $path;

        return $this;
    }

    public function isMarkdown(bool $isMarkdown): self
    {
        $this->isMarkdown = $isMarkdown;

        return $this;
    }

    /** @param list<string> $lines */
    public function lines(array $lines): self
    {
        $this->lines = $lines;

        return $this;
    }

    /** @param list<int> $cutLineNumbers */
    public function cutLineNumbers(array $cutLineNumbers): self
    {
        $this->cutLineNumbers = $cutLineNumbers;

        return $this;
    }

    public function isTruncated(bool $isTruncated): self
    {
        $this->isTruncated = $isTruncated;

        return $this;
    }

    public function digest(string|null $digest): self
    {
        $this->digest = $digest;
        $this->hasDigest = true;

        return $this;
    }

    public function size(int|null $size): self
    {
        $this->size = $size;
        $this->hasSize = true;

        return $this;
    }

    public function commentTarget(string|null $commentTarget): self
    {
        $this->commentTarget = $commentTarget;
        $this->hasCommentTarget = true;

        return $this;
    }

    /** @param list<FileThreadData> $threads */
    public function threads(array $threads): self
    {
        $this->threads = $threads;

        return $this;
    }

    public function recipientId(string|null $recipientId): self
    {
        $this->recipientId = $recipientId;
        $this->hasRecipientId = true;

        return $this;
    }

    public function recipientName(string|null $recipientName): self
    {
        $this->recipientName = $recipientName;
        $this->hasRecipientName = true;

        return $this;
    }

    public function commentAddress(string|null $commentAddress): self
    {
        $this->commentAddress = $commentAddress;
        $this->hasCommentAddress = true;

        return $this;
    }

    public function tellAddress(string|null $tellAddress): self
    {
        $this->tellAddress = $tellAddress;
        $this->hasTellAddress = true;

        return $this;
    }

    public function markdown(LayoutBodyData|Optional $markdown): self
    {
        $this->markdown = $markdown;

        return $this;
    }

    public function finish(): FileWindowData
    {
        if (! isset($this->status)) {
            throw MissingFields::forType(FileWindowData::class, 'status');
        }

        if (! isset($this->name)) {
            throw MissingFields::forType(FileWindowData::class, 'name');
        }

        if (! isset($this->path)) {
            throw MissingFields::forType(FileWindowData::class, 'path');
        }

        if (! isset($this->isMarkdown)) {
            throw MissingFields::forType(FileWindowData::class, 'isMarkdown');
        }

        if (! isset($this->lines)) {
            throw MissingFields::forType(FileWindowData::class, 'lines');
        }

        if (! isset($this->cutLineNumbers)) {
            throw MissingFields::forType(FileWindowData::class, 'cutLineNumbers');
        }

        if (! isset($this->isTruncated)) {
            throw MissingFields::forType(FileWindowData::class, 'isTruncated');
        }

        if (! $this->hasDigest) {
            throw MissingFields::forType(FileWindowData::class, 'digest');
        }

        if (! $this->hasSize) {
            throw MissingFields::forType(FileWindowData::class, 'size');
        }

        if (! $this->hasCommentTarget) {
            throw MissingFields::forType(FileWindowData::class, 'commentTarget');
        }

        if (! isset($this->threads)) {
            throw MissingFields::forType(FileWindowData::class, 'threads');
        }

        if (! $this->hasRecipientId) {
            throw MissingFields::forType(FileWindowData::class, 'recipientId');
        }

        if (! $this->hasRecipientName) {
            throw MissingFields::forType(FileWindowData::class, 'recipientName');
        }

        if (! $this->hasCommentAddress) {
            throw MissingFields::forType(FileWindowData::class, 'commentAddress');
        }

        if (! $this->hasTellAddress) {
            throw MissingFields::forType(FileWindowData::class, 'tellAddress');
        }

        return new FileWindowData(
            status: $this->status,
            name: $this->name,
            path: $this->path,
            isMarkdown: $this->isMarkdown,
            lines: $this->lines,
            cutLineNumbers: $this->cutLineNumbers,
            isTruncated: $this->isTruncated,
            digest: $this->digest,
            size: $this->size,
            commentTarget: $this->commentTarget,
            threads: $this->threads,
            recipientId: $this->recipientId,
            recipientName: $this->recipientName,
            commentAddress: $this->commentAddress,
            tellAddress: $this->tellAddress,
            markdown: $this->markdown,
        );
    }
}
