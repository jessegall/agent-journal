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
     * Whether the order writes into a process, so a host restart while it was claimed may have half carried it out.
     */
    public function isInput(): bool
    {
        return match ($this) {
            self::WriteKeys, self::WriteStdin, self::CloseStdin, self::WritePrivate => true,
            default => false,
        };
    }
}
