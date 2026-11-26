<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * What may sit directly under app and under a package's src: Laravel's role
 * folders and the named root files.
 */
final readonly class LayoutRoots
{
    private const array CORE_ROOT_FILES = [
        'CoreCommands.php',
        'CorePages.php',
        'CoreMcpTools.php',
    ];

    /**
     * The role folders a root may hold; Actions is Access's alone, which FolderLayoutTest checks on its own.
     */
    private const array ROLE_FOLDERS = [
        'Actions',
        'Api',
        'Attributes',
        'Casts',
        'CommandMiddleware',
        'Commands',
        'Concerns',
        'Console',
        'Contracts',
        'Data',
        'Declarations',
        'Enums',
        'Events',
        'Exceptions',
        'Http',
        'Jobs',
        'Listeners',
        'Mcp',
        'Models',
        'Observers',
        'Pages',
        'Pipelines',
        'Pipes',
        'Policies',
        'Providers',
        'Resolvers',
        'Support',
        'Values',
    ];

    /**
     * The subject folders of the subject-first layout, each holding its own subject's classes.
     */
    private const array SUBJECT_FOLDERS = [
        'Access',
        'Accounts',
        'Actors',
        'Agents',
        'Asks',
        'Assignments',
        'Bootstrap',
        'Bus',
        'CommandRules',
        'Connections',
        'Docking',
        'Engine',
        'Files',
        'Hooks',
        'Hosts',
        'Inboxes',
        'Links',
        'Messages',
        'Navigation',
        'Notifications',
        'Numbers',
        'Processes',
        'Profiles',
        'Projects',
        'Reads',
        'Records',
        'Reflection',
        'Scripts',
        'Search',
        'Sessions',
        'Settings',
        'Sharing',
        'Skills',
        'Stacks',
        'Terminals',
        'Text',
        'Time',
        'Web',
    ];

    /**
     * Core's roots.
     */
    public static function core(): self
    {
        return new self();
    }

    /**
     * A package's src roots, the same role folders as Core's.
     */
    public static function package(): self
    {
        return new self();
    }

    /**
     * The folders and files of a root that are neither a role folder nor an allowed root file, each as given.
     *
     * @param  list<string>  $folders  root-relative folder names
     * @param  list<string>  $files  root-relative file names
     * @param  list<string>  $rootFiles  the file names allowed at this root
     * @return list<string>
     */
    public function misplaced(array $folders, array $files, array $rootFiles): array
    {
        return [
            ...array_values(array_diff($folders, self::ROLE_FOLDERS, self::SUBJECT_FOLDERS)),
            ...array_values(array_diff($files, $rootFiles)),
        ];
    }

    /**
     * @return list<string>
     */
    public static function coreRootFiles(): array
    {
        return self::CORE_ROOT_FILES;
    }
}
