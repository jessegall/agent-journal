<?php

declare(strict_types=1);

namespace App\Access\Contracts;

/**
 * A policy over what lies in the workspace: an access of it that changes files is never granted to a read-only
 * profile.
 */
interface WorkspacePolicy extends Policy {}
