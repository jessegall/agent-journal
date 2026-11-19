<?php

declare(strict_types=1);

namespace App\Agents\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A key the main agent may press on a stalled screen, by name: the arrows, enter, esc, tab, space, a digit, y and n.
 * No other control key is ever sent.
 */
#[TypeScript]
enum NavigationKey: string
{
    case Up = 'up';
    case Down = 'down';
    case Left = 'left';
    case Right = 'right';
    case Enter = 'enter';
    case Esc = 'esc';
    case Tab = 'tab';
    case Space = 'space';
    case Y = 'y';
    case N = 'n';
    case Zero = '0';
    case One = '1';
    case Two = '2';
    case Three = '3';
    case Four = '4';
    case Five = '5';
    case Six = '6';
    case Seven = '7';
    case Eight = '8';
    case Nine = '9';
}
