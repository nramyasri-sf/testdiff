
import { Command, flags } from '@oclif/command';
import * as _ from 'lodash';
import * as fsx from 'fs-extra'

interface CommandArray {
    flags: string[];
    command: string
}


export default class Test extends Command {

    public static flags = {
        goldfile: flags.string({ default: './command-gold-file.json' })
    };

    /**
     * @param initialCommands list of commands from the gold file
     * @param updatedCommands new list of commands
     */

    public async compareDiff(initialCommands : CommandArray[], updatedCommands: CommandArray[]) {
        let result;
        let diffCommands :string[] = [];
        initialCommands.forEach(intialCommand => {
            updatedCommands.forEach(updatedcommand => {
                if (intialCommand.command === updatedcommand.command) {
                    result = this.diffCommandFlags(intialCommand.flags, updatedcommand.flags, intialCommand.command);
                    if (result === false) {
                        diffCommands.push(intialCommand.command);
                    }
                }
            });
        });

        /** Check if existant commands have been deleted */
        if (Object.keys(updatedCommands).length < Object.keys(initialCommands).length) {
            this.log('These commands have been deleted, please check again   :' , this.diffCommands(initialCommands, updatedCommands));
        }

        if (diffCommands.length > 0) {
            this.log(`There have been changes in the flags of the following commands  :  ${diffCommands}. Please check again.`);
        }

        if (Object.keys(initialCommands).length === Object.keys(updatedCommands).length) {
            if (_.isEqual(initialCommands, updatedCommands) && diffCommands.length === 0) {
                this.log('No changes have been detected.');
            }
        }
    }

    /** Returns true if there is no difference in the current and updated flags */
    public diffCommandFlags(oldFlags: string[], newflags: string[], initialCommand: string) {
        let result = false;
        if (newflags.length > oldFlags.length) {
            const difference = newflags.filter(flag => !oldFlags.includes(flag));
            console.log(`New flags  :  ${difference} have been for the command : ${initialCommand}`);
            result = true;
        }
        if (_.isEqual(oldFlags, newflags)) {
            result = true;
        }
        return result;
    }

    /** Returns the difference between initial command list and the updated list */
    public diffCommands(initialCommands: CommandArray[], updatedCommands : CommandArray[]) {
        return initialCommands.filter(i => !updatedCommands.some(u => u.command === i.command));
    }

    public async run() {
        const { flags } = this.parse(Test);
        const oldCommandFlags = JSON.parse(fsx.readFileSync(flags.goldfile).toString('utf8'));
        const newCommandFlags = this.config.commands;
        const resultnewCommandFlags : CommandArray[]= _.sortBy(newCommandFlags, 'id').map(command => {
            return {
                command: command.id,
                flags: Object.entries(command.flags).map(flagName => flagName[0])
            };
        });
        const updatedCommands = await this.compareDiff(oldCommandFlags, resultnewCommandFlags);
        return updatedCommands;
    }
}
