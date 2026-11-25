<?php

declare(strict_types=1);

namespace App\Enums\CommandRules;

/**
 * How an executable binding is trusted: by a built-in install location, by the content of a project tool, or by the
 * install location of a module package.
 */
enum BindingType: string
{
    case BuiltinSearchPath = 'builtin_search_path';
    case ProjectContent = 'project_content';
    case ModulePackage = 'module_package';
}
