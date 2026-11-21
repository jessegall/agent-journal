<?php

declare(strict_types=1);

namespace App\Connections\Enums;

/**
 * What redeeming an install line does: connect a new project, or join the folder to a project already connected.
 */
enum InvitationMode: string
{
    case New = 'new';
    case Join = 'join';
}
