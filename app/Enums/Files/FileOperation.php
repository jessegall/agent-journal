<?php

declare(strict_types=1);

namespace App\Enums\Files;

use App\Exceptions\UnknownPatchAction;
use App\Enums\Agents\AccessType;

/**
 * What a native file tool does to one path; a write to a path that may or may not exist both creates and edits.
 */
enum FileOperation: string
{
    case Create = 'create';
    case Edit = 'edit';
    case Delete = 'delete';
    case Write = 'write';

    /**
     * The operation an apply_patch file line names: Add, Update or Delete.
     */
    public static function fromPatchAction(string $action): self
    {
        return match ($action) {
            'Add' => self::Create,
            'Update' => self::Edit,
            'Delete' => self::Delete,
            default => throw UnknownPatchAction::forAction($action),
        };
    }

    /**
     * Every access the operation needs on its path.
     *
     * @return list<AccessType>
     */
    public function accessTypes(): array
    {
        return match ($this) {
            self::Create => [AccessType::Create],
            self::Edit => [AccessType::Edit],
            self::Delete => [AccessType::Delete],
            self::Write => [
                AccessType::Create,
                AccessType::Edit,
            ],
        };
    }
}
