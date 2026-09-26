# Requisitos — Expedição Express

Fonte da verdade dos requisitos funcionais (RF) e não funcionais (RNF). Cite o código do requisito (ex.: `RF15`) em commits, PRs e na matriz de rastreabilidade.

---

## 2.1 Requisitos Funcionais (RF)

*Os requisitos funcionais descrevem o que o sistema deve permitir que seus usuários realizem.*

### Autenticação e usuários

- **RF01 – Autenticação:** O sistema deve permitir que usuários cadastrados realizem login utilizando suas credenciais de acesso.

- **RF02 – Encerramento de sessão:** O sistema deve permitir que o usuário encerre sua sessão por meio da opção de logout.

- **RF03 – Cadastro de entregadores:** O sistema deve permitir que um usuário responsável pela gestão cadastre entregadores, informando dados básicos como nome, telefone e situação cadastral.

- **RF04 – Consulta de entregadores:** O sistema deve permitir visualizar a relação de entregadores cadastrados e consultar suas informações.

- **RF05 – Situação do entregador:** O sistema deve permitir definir a situação de um entregador, como disponível, em rota ou indisponível.

---

### Gestão de encomendas

- **RF06 – Cadastro de encomendas:** O sistema deve permitir o cadastro de uma nova encomenda contendo, no mínimo, identificação da encomenda, dados do remetente, dados do destinatário, endereço de coleta e endereço de entrega.

- **RF07 – Código de rastreamento:** O sistema deve gerar ou associar um código de identificação único para cada encomenda cadastrada.

- **RF08 – Consulta de encomendas:** O sistema deve apresentar uma lista contendo as encomendas cadastradas e suas principais informações.

- **RF09 – Detalhes da encomenda:** O sistema deve permitir consultar os detalhes de uma encomenda, incluindo remetente, destinatário, endereço, entregador responsável, status atual e histórico da entrega.

- **RF10 – Edição de encomendas:** O sistema deve permitir alterar os dados de uma encomenda enquanto ela ainda não tiver sido finalizada.

- **RF11 – Busca de encomendas:** O sistema deve permitir localizar uma encomenda por código de rastreamento, nome do destinatário ou outras informações disponíveis no cadastro.

- **RF12 – Filtro de encomendas:** O sistema deve permitir filtrar as encomendas por critérios como status, data e entregador responsável.

---

### Gestão das entregas

- **RF13 – Atribuição de entregador:** O sistema deve permitir atribuir uma ou mais encomendas a um entregador cadastrado.

- **RF14 – Visualização das entregas atribuídas:** O sistema deve permitir que o entregador consulte as encomendas que foram atribuídas a ele.

- **RF15 – Atualização de status:** O sistema deve permitir atualizar o status de uma encomenda durante as etapas do processo de coleta e entrega.

- **RF16 – Status da encomenda:** O sistema deve trabalhar, no mínimo, com os seguintes status: "Aguardando coleta", "Coletada", "Em rota de entrega", "Entregue" e "Entrega não realizada".

- **RF17 – Motivo de entrega não realizada:** Quando uma entrega não puder ser concluída, o sistema deve permitir que o entregador registre o motivo da ocorrência.

- **RF18 – Histórico da encomenda:** O sistema deve manter um histórico das alterações de status da encomenda, contendo o status registrado e a data e horário da atualização.

---

### Comprovante de entrega

- **RF19 – Registro do comprovante:** O sistema deve permitir que o entregador registre digitalmente um comprovante após realizar a entrega da encomenda.

- **RF20 – Dados do comprovante:** O comprovante deve registrar informações que permitam confirmar a entrega, como nome de quem recebeu, data e horário.

- **RF21 – Evidência de entrega:** O sistema deve permitir anexar uma evidência da entrega, como fotografia ou assinatura digital, quando necessário.

- **RF22 – Consulta do comprovante:** O sistema deve permitir que a equipe responsável consulte posteriormente o comprovante associado à encomenda.

---

### Rastreamento

- **RF23 – Rastreamento da encomenda:** O sistema deve permitir consultar o andamento de uma encomenda utilizando seu código de rastreamento.

- **RF24 – Exibição do histórico de rastreamento:** O sistema deve apresentar ao usuário as principais etapas pelas quais a encomenda passou, juntamente com suas respectivas datas e horários.

- **RF25 – Status atual no rastreamento:** O sistema deve destacar o status atual da encomenda na tela de rastreamento.

- **RF26 – Consulta pelo cliente:** O sistema deve disponibilizar uma página de rastreamento que permita ao cliente consultar sua encomenda sem acessar as funcionalidades administrativas.

---

### Coletas e rotas

- **RF27 – Organização das coletas:** O sistema deve permitir visualizar as encomendas que ainda estão aguardando coleta.

- **RF28 – Organização das entregas:** O sistema deve permitir agrupar as encomendas que serão realizadas por cada entregador.

- **RF29 – Visualização de endereços:** O sistema deve apresentar ao entregador os endereços de coleta e entrega das encomendas atribuídas.

- **RF30 – Organização da rota:** O sistema deve permitir organizar a sequência de coletas e entregas atribuídas ao entregador.

- **RF31 – Visualização da rota:** O sistema deve permitir visualizar em mapa os pontos de coleta e entrega pertencentes a uma rota.

---

### Painel de gerenciamento

- **RF32 – Dashboard:** O sistema deve apresentar um painel inicial contendo um resumo da operação de entregas.

- **RF33 – Indicadores de encomendas:** O painel deve informar, no mínimo, a quantidade de encomendas aguardando coleta, em rota, entregues e com falha na entrega.

- **RF34 – Entregas recentes:** O sistema deve apresentar as encomendas ou movimentações mais recentes para facilitar o acompanhamento da operação.

- **RF35 – Consulta por período:** O sistema deve permitir consultar as entregas realizadas dentro de um determinado período.

---

## 2.2 Requisitos Não Funcionais (RNF)

*Os requisitos não funcionais definem características de qualidade e restrições sobre como o sistema deve funcionar.*

### Usabilidade

- **RNF01 – Responsividade:** A interface deve ser responsiva e adaptar-se adequadamente a computadores, tablets e dispositivos móveis.

- **RNF02 – Facilidade de navegação:** As principais funcionalidades do sistema devem estar disponíveis por meio de menus e elementos visuais de fácil identificação.

- **RNF03 – Consistência visual:** As páginas do sistema devem utilizar padrões consistentes de cores, tipografia, botões, formulários e demais componentes da interface.

- **RNF04 – Feedback ao usuário:** O sistema deve informar ao usuário quando uma operação for realizada com sucesso ou quando ocorrer algum erro.

- **RNF05 – Identificação dos status:** Os diferentes status das encomendas devem possuir identificação visual clara para facilitar sua compreensão.

- **RNF06 – Facilidade de operação:** As ações utilizadas frequentemente pelos entregadores, principalmente atualização de status e registro de comprovante, devem exigir poucos passos.

---

### Desempenho

- **RNF07 – Tempo de resposta:** Consultas comuns, como listagem, pesquisa e visualização de encomendas, devem apresentar resposta em até 2 segundos em condições normais de utilização.

- **RNF08 – Atualização das informações:** Após uma atualização de status realizada com sucesso, a nova situação da encomenda deve ser apresentada imediatamente nas próximas consultas ao sistema.

- **RNF09 – Carregamento das páginas:** As principais telas do sistema devem ser carregadas sem atrasos que prejudiquem a utilização normal do usuário.

---

### Segurança

- **RNF10 – Controle de acesso:** As funcionalidades administrativas devem estar disponíveis somente para usuários autenticados.

- **RNF11 – Perfis de acesso:** O sistema deve controlar as funcionalidades disponíveis de acordo com o tipo de usuário, diferenciando, no mínimo, gestores e entregadores.

- **RNF12 – Proteção de credenciais:** As senhas dos usuários não devem ser armazenadas em formato de texto simples.

- **RNF13 – Proteção das informações:** O sistema deve impedir que usuários não autorizados alterem informações relacionadas às encomendas e entregas.

- **RNF14 – Sessão do usuário:** O sistema deve impedir o acesso às áreas restritas após o usuário realizar logout.

---

### Confiabilidade e integridade

- **RNF15 – Integridade do histórico:** Os registros do histórico de uma encomenda não devem ser alterados automaticamente quando um novo status for incluído.

- **RNF16 – Integridade do comprovante:** Um comprovante de entrega deve permanecer associado à encomenda correspondente para consultas futuras.

- **RNF17 – Identificação única:** Cada encomenda deve possuir um identificador único no sistema, evitando duplicidade na identificação das entregas.

- **RNF18 – Persistência dos dados:** As informações cadastradas no sistema devem permanecer armazenadas após o encerramento da sessão do usuário.

---

### Disponibilidade e compatibilidade

- **RNF19 – Disponibilidade:** O sistema deve permanecer disponível durante o período de funcionamento da empresa, exceto em períodos programados de manutenção.

- **RNF20 – Compatibilidade com navegadores:** O sistema web deve funcionar corretamente nas versões atuais dos principais navegadores utilizados no mercado.

- **RNF21 – Acesso móvel:** As funcionalidades utilizadas pelos entregadores devem funcionar adequadamente por meio do navegador de dispositivos móveis.

---

### Acessibilidade

- **RNF22 – Legibilidade:** Os textos e informações apresentados na interface devem possuir tamanho e contraste adequados para leitura.

- **RNF23 – Identificação além das cores:** Informações importantes, como status de entrega, não devem depender exclusivamente de cores para sua identificação.

- **RNF24 – Formulários:** Os campos dos formulários devem possuir identificação clara sobre a informação que deve ser preenchida.

---

### Manutenibilidade

- **RNF25 – Organização do sistema:** O sistema deve ser desenvolvido de maneira modular, facilitando futuras correções e inclusão de novas funcionalidades.

- **RNF26 – Padronização:** O código-fonte deve seguir padrões de organização e nomenclatura definidos pela equipe de desenvolvimento.
