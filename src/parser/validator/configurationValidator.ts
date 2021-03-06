/*
Copyright 2020 IRT SystemX

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as YamlValidator from 'yaml-validator';
import { l } from '../../utils/logs';

// TODO use directly the js-yaml safeLoad schema options
/**
 *
 * @author wassim.znaidi@gmail.com
 */
export class ConfigurationValidator {
  static structureDeployment = {
    chains: {
      template_folder: 'string',
      fabric: 'string',
      tls: 'boolean',
      consensus: 'string',
      db: 'string',
      organisations: [
        {
          organisation: 'string',
          engineOrg: 'string',
          domain_name: 'string',
          ca: {
            name: 'string',
            engine_name: 'string'
          },
          orderers: [
            {
              orderer: 'string',
              engine_name: 'string'
            }
          ],
          peers: [
            {
              peer: 'string',
              engine_name: 'string'
            }
          ]
        }
      ]
    },
    engines: [
      {
        engine: 'string',
        hosts: [
          {
            host: 'string',
            type: 'string',
            url: 'string',
            port: 'number',
            settings: ['string']
          }
        ]
      }
    ]
  };

  static structureGenesis = {
    genesis: {
      template_folder: 'string',
      consensus: 'string',
      organisations: [
        {
          organisation: 'string',
          domain_name: 'string',
          orderers: [
            {
              orderer: 'string',
              host_name: 'string',
              port: 'number'
            }
          ],
          anchorPeer: {
            host_name: 'string',
            port: 'number'
          }
        }
      ]
    }
  };

  isValidDeployment(filePath: string) {
    return ConfigurationValidator.isValid(filePath, this.getValidatorOptions(ConfigurationValidator.structureDeployment));
  }

  isValidGenesis(filePath: string) {
    return ConfigurationValidator.isValid(filePath, this.getValidatorOptions(ConfigurationValidator.structureGenesis));
  }

  private getValidatorOptions(structure): YamlValidator.IYamlValidatorOptions {
    return {
      log: false,
      structure: structure,
      onWarning: function(error, filepath) {
        l(`${filepath} has error: ${error}`);
      },
      writeJson: false
    };
  }

  // TODO in case of error, display it
  private static isValid(filePath: string, options: YamlValidator.IYamlValidatorOptions) {
    l(`Validating ${filePath}...`);
    const validator = new YamlValidator(options);
    validator.validate([filePath]);
    const reports = validator.report();

    return reports == 0;
  }
}
