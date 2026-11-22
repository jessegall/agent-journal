<?php

declare(strict_types=1);

namespace App\Ui\Enums;

/**
 * The host's icons a page or a navigation item may name; each value is a shape the browser's Icon component draws.
 */
enum Icon: string
{
    case Home = 'home';
    case Chat = 'chat';
    case Plan = 'plan';
    case Tasks = 'todos';
    case Rules = 'rules';
    case Docs = 'docs';
    case Activity = 'activity';
    case Accounts = 'accounts';
    case Connections = 'connections';
}
