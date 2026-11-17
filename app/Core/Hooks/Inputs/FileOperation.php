<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

use App\Core\Hooks\Exceptions\UnknownPatchAction;

enum FileOperation: string
{
    case Create = 'create';
    case Edit = 'edit';
    case Delete = 'delete';

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
}
