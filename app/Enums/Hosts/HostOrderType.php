<?php

declare(strict_types=1);

namespace App\Enums\Hosts;

/**
 * Every order of host protocol 1, the whole vocabulary a host carries out.
 */
enum HostOrderType: string
{
    case OpenContainer = 'open_container';
    case OpenProcess = 'open_process';
    case WriteKeys = 'write_keys';
    case WriteStdin = 'write_stdin';
    case CloseStdin = 'close_stdin';
    case OpenPrivate = 'open_private';
    case WritePrivate = 'write_private';
    case ClosePrivate = 'close_private';
    case Resize = 'resize';
    case Signal = 'signal';
    case Stop = 'stop';
    case Stream = 'stream';
    case Snapshot = 'snapshot';
    case RunFenced = 'run_fenced';
    case AllowImages = 'allow_images';
    case MakeFolder = 'make_folder';
    case RemoveFolder = 'remove_folder';
    case FolderUse = 'folder_use';
    case Remove = 'remove';
    case ReadProject = 'read_project';
    case Record = 'record';
    case StopRecording = 'stop_recording';
    case Upgrade = 'upgrade';

    /**
     * The orders that write into a process, so a host restart while one was claimed may have half carried it out.
     *
     * @return list<self>
     */
    public static function inputs(): array
    {
        return array_values(array_filter(self::cases(), fn (self $type) => $type->isInput()));
    }

    /**
     * Whether the order ends its process, so a process that ended still lets its host answer it.
     */
    public function endsProcess(): bool
    {
        return $this === self::Stop || $this === self::Remove;
    }

    public function isInput(): bool
    {
        return match ($this) {
            self::WriteKeys, self::WriteStdin, self::CloseStdin, self::WritePrivate => true,
            default => false,
        };
    }

    /**
     * Whether this order opens a process, so its payload carries the process's environment.
     */
    public function isOpening(): bool
    {
        return match ($this) {
            self::OpenProcess, self::OpenContainer => true,
            default => false,
        };
    }

    /**
     * Whether this order can be carried out on a process of that type: keys and screens need a terminal, standard
     * input needs pipes.
     */
    public function suits(HostProcessType $type): bool
    {
        return match ($this) {
            self::WriteKeys, self::Resize, self::Stream, self::Snapshot => $type === HostProcessType::Terminal,
            self::WriteStdin, self::CloseStdin => $type === HostProcessType::Pipe,
            default => true,
        };
    }
}
